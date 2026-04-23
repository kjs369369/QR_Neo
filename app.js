document.addEventListener('DOMContentLoaded', () => {
    const qrText = document.getElementById('qr-text');
    const dotsColor = document.getElementById('dots-color');
    const bgColor = document.getElementById('bg-color');
    const dotsStyle = document.getElementById('dots-style');
    const cornersStyle = document.getElementById('corners-style');
    const exportFormat = document.getElementById('export-format');
    const downloadBtn = document.getElementById('download-btn');
    const shortenBtn = document.getElementById('shorten-btn');
    const logoUpload = document.getElementById('logo-upload');
    const removeLogoBtn = document.getElementById('remove-logo-btn');
    const canvasContainer = document.getElementById('canvas-container');

    let currentLogo = "";

    // Initialize QR Code Styling
    const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "svg",
        data: qrText.value,
        image: "",
        dotsOptions: {
            color: dotsColor.value,
            type: dotsStyle.value
        },
        backgroundOptions: {
            color: bgColor.value,
        },
        cornersSquareOptions: {
            type: cornersStyle.value,
            color: dotsColor.value
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 5,
            imageSize: 0.4
        }
    });

    // Initial Render
    qrCode.append(canvasContainer);

    // Update Function
    const updateQR = () => {
        qrCode.update({
            data: qrText.value || " ",
            image: currentLogo,
            dotsOptions: {
                color: dotsColor.value,
                type: dotsStyle.value
            },
            backgroundOptions: {
                color: bgColor.value,
            },
            cornersSquareOptions: {
                type: cornersStyle.value,
                color: dotsColor.value
            }
        });
    };

    // Event Listeners for customization
    [qrText, dotsColor, bgColor, dotsStyle, cornersStyle].forEach(el => {
        el.addEventListener('input', updateQR);
    });

    // URL Shortening Logic (is.gd API)
    shortenBtn.addEventListener('click', async () => {
        const url = qrText.value;
        if (!url || !url.startsWith('http')) {
            alert('단축할 수 있는 올바른 URL을 입력해주세요.');
            return;
        }

        shortenBtn.disabled = true;
        shortenBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>...';

        try {
            // TinyURL API - always redirects directly without interstitial pages
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
            const shortUrl = await response.text();
            
            if (shortUrl && shortUrl.startsWith('http')) {
                qrText.value = shortUrl.trim();
                updateQR();
            } else {
                alert('URL 단축에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            shortenBtn.disabled = false;
            shortenBtn.innerHTML = '<i class="fa-solid fa-scissors"></i> URL 단축';
        }
    });

    // Logo Upload Handling
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentLogo = event.target.result;
                updateQR();
            };
            reader.readAsDataURL(file);
        }
    });

    // Remove Logo Logic
    removeLogoBtn.addEventListener('click', () => {
        currentLogo = "";
        logoUpload.value = "";
        updateQR();
    });

    // Download Functionality
    downloadBtn.addEventListener('click', () => {
        const format = exportFormat.value;
        qrCode.download({ 
            name: "qr-code", 
            extension: format 
        });
    });
});
