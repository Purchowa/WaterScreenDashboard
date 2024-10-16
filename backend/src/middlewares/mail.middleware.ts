import { Request, Response, NextFunction } from 'express';
import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer'
import fs from 'fs';

import WaterscreenStateService from '../modules/services/waterscreenState.service';
import ConfigService from '../modules/services/config.service';

import { WaterscreenStateModelType, FluidLevel } from '../modules/models/waterscreenState.model';
import { config } from '../config';

function setupMailTransporter() {
    return nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: config.GMAIL_SECRET.login,
            pass: config.GMAIL_SECRET.passw
        }
    });
}

function setupMailContent(mailList: string[], content: string): Mail.Options {
    return {
        from: config.GMAIL_SECRET.login,
        to: mailList,
        subject: "AT - ekran wodny",
        html: content
    };
}

function sendMail(mailList: string[], htmlContent: string) {
    const transporter = setupMailTransporter();
    const mailOptions = setupMailContent(mailList, htmlContent);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error)
            console.error("Error sending email\n", error);
        else {
            console.log("Email successfully send\n", info.response);
        }
    });
}

function sendMailWithHtmlContent(path: string, mailList: string[], sendMail: (mailList: string[], htmlContent: string) => void) {
    fs.readFile(path, 'utf8', (error, htmlContent) => {
        if (!error) {
            sendMail(mailList, htmlContent);
        }
        else
            console.error(error);
    });
}

export function handleLowWaterMailNotification(request: Request, response: Response, next: NextFunction) {
    const newState: WaterscreenStateModelType = request.body;

    if (newState.fluidLevel === FluidLevel.Low) {
        const stateService = new WaterscreenStateService();
        stateService.getLatestState()
            .then((state) => {
                if (state && state.fluidLevel !== newState.fluidLevel) {
                    const configService = new ConfigService();
                    configService.getAllConfig()
                        .then((waterscreenCfg) => {
                            if (waterscreenCfg && waterscreenCfg.mailList) {
                                sendMailWithHtmlContent('src/assets/email_template.html', waterscreenCfg.mailList, sendMail);
                            }
                        })
                        .catch((error) => { console.error(error); });
                }
                next();

            })
            .catch((error) => { console.error(error); });
    }
    else {
        next();
    }

}