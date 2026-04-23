document.addEventListener('DOMContentLoaded', () => {
    const qrText = document.getElementById('qr-text');
    const dotsColor = document.getElementById('dots-color');
    const bgColor = document.getElementById('bg-color');
    const dotsStyle = document.getElementById('dots-style');
    const cornersStyle = document.getElementById('corners-style');
    const exportFormat = document.getElementById('export-format');
    const downloadBtn = document.getElementById('download-btn');
    const canvasContainer = document.getElementById('canvas-container');

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
            margin: 10
        }
    });

    // Initial Render
    qrCode.append(canvasContainer);

    // Update Function
    const updateQR = () => {
        qrCode.update({
            data: qrText.value || " ",
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

    // Event Listeners
    [qrText, dotsColor, bgColor, dotsStyle, cornersStyle].forEach(el => {
        el.addEventListener('input', updateQR);
    });

    // Download Functionality with selected format
    downloadBtn.addEventListener('click', () => {
        const format = exportFormat.value;
        qrCode.download({ 
            name: "qr-code", 
            extension: format 
        });
    });
});
