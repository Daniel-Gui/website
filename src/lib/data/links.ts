export const SOCIAL_LINKS = {
    EMAIL: 'dandanielofc@gmail.com',
    WHATSAPP_E164: '5591993105821',
    LINKEDIN: 'https://www.linkedin.com/in/danielguii',
    RESUME_PTBR: '/resume/resume-daniel-guimaraes-ptbr.pdf',
    RESUME_EN: '/resume/resume-daniel-guimaraes-english.pdf'
} as const;

export const WHATSAPP_URL = `https://wa.me/${SOCIAL_LINKS.WHATSAPP_E164}?text=${encodeURIComponent(
    'Olá Daniel! Vi seu portfólio e gostaria de conversar.'
)}`;

export const MAILTO_URL = `mailto:${SOCIAL_LINKS.EMAIL}?subject=${encodeURIComponent(
    'Projeto / oportunidade'
)}&body=${encodeURIComponent('Olá Daniel! Vi seu portfólio e gostaria de conversar.')}`;
