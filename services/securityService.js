// services/securityService.js
import fs from 'fs';

export const scanForSecrets = (files) => {
    const secretsFound = [];

    // Common patterns for leaked secrets
    const patterns = {
    'AWS Access Key ID': /AKIA[0-9A-Z]{16}/g,
    'AWS Secret Access Key': /aws_secret_access_key\s*=\s*[0-9a-zA-Z\/+]{40}/gi,
    'Generic API Key': /(api_key|apikey|secret)\s*[:=]\s*['"][a-zA-Z0-9\-_]{16,64}['"]/gi,
    'RSA Private Key': /-----BEGIN RSA PRIVATE KEY-----/g,
    'Github Personal Access Token': /ghp_[a-zA-Z0-9]{36}/g,

    'MongoDB URI': /mongodb(?:\+srv)?:\/\/[a-zA-Z0-9_.-]+:[^@\s]+@[a-zA-Z0-9_.-]+(?::\d+)?\/?[^\s?]*/g,
    'Slack Webhook': /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9_]{8}\/B[A-Z0-9_]{8}\/[A-Za-z0-9_]{24}/g,
    'GCP API Key': /AIza[0-9A-Za-z-_]{35}/g,
    'Stripe Secret Key': /sk_live_[0-9a-zA-Z]{24}/g
};


    files.forEach(filePath => {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, index) => {
                // Check the line against all our regex patterns
                for (const [secretType, regex] of Object.entries(patterns)) {
                    if (regex.test(line)) {
                        secretsFound.push({
                            type: secretType,
                            file: filePath,
                            line: index + 1
                        });
                    }
                }
            });
        } catch (error) {
            console.error(`Security scan failed for file: ${filePath}`);
        }
    });

    return secretsFound;
};