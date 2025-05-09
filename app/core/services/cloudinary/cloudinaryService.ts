import { v2 as cloudinary } from 'cloudinary';

// Configurer cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const CloudinaryService = {
    // Fonction pour télécharger un fichier sur Cloudinary
    async uploadFile(file: File, folder: string = 'uploads') {
        return new Promise<any>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                try {
                    const base64data = reader.result?.toString().split(',')[1];

                    if (!base64data) {
                        reject(new Error('Erreur lors de la lecture du fichier'));
                        return;
                    }

                    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64data}`, {
                        folder: folder,
                    });

                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    },

    // Fonction pour supprimer un fichier de Cloudinary
    async deleteFile(fileUrl: string, folder: string = '') {
        try {
            // Extraire l'ID public du fichier à partir de l'URL
            const urlParts = fileUrl.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const folderPath = urlParts[urlParts.length - 2];
            
            const publicId = publicIdWithExtension.split('.')[0];
            const fullPublicId = folder ? `${folder}/${publicId}` : `${folderPath}/${publicId}`;

            if (publicId) {
                const result = await cloudinary.uploader.destroy(fullPublicId);
                return result;
            }
            return null;
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            throw error;
        }
    }
};