import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        message,
        timestamp: new Date(),
      },
    });

    const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          } as SMTPTransport.Options);

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `📩 New message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr />
        <p>Sent at ${new Date().toLocaleString()}</p>
      `,
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
