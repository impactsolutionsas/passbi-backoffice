import nodemailer from 'nodemailer';

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter;
  private senderEmail: string;

  private constructor() {
    this.senderEmail = 'gningeli03@gmail.com'; 
    
    // Création du transporteur avec les identifiants Google
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.senderEmail,
        pass: 'khfw gkdy cugc abod' // La clé d'application générée pour votre compte Google
      }
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Envoie un email en utilisant Nodemailer avec Gmail
   */
  public async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      // Configuration du message
      const mailOptions = {
        from: `"Notre Application" <${this.senderEmail}>`,
        to: to,
        subject: subject,
        html: html
      };
      
      // Envoi de l'email
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé:', info.messageId);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  }

  /**
   * Envoie un email spécifique pour les identifiants de connexion
   */
  public async sendCredentials(to: string, name: string, email: string, password: string): Promise<boolean> {
    const subject = 'Vos identifiants de connexion';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #3b82f6; text-align: center;">Bienvenue dans notre application PassBi</h2>
        <p>Bonjour <strong>${name}</strong>,</p>
        <p>Votre compte a été créé avec succès. Voici vos identifiants de connexion:</p>
        <div style="background-color: #f0f7ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mot de passe:</strong> ${password}</p>
        </div>
        <p><strong>Important:</strong> Utilisez ces informations pour vous connecter. Nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>
        <p>Cordialement,<br>L'équipe de support</p>
      </div>
    `;
    
    // Appel à la méthode sendEmail pour effectuer l'envoi
    return await this.sendEmail(to, subject, html);
  }
}

export const emailService = EmailService.getInstance();