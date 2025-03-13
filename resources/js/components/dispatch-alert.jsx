export default function ({ status, obj, text }) {
    const event = new CustomEvent('alert', {
        detail: {
            title: status ? 'Berhasil!' : 'Gagal!',
            icon: status ? 'success' : 'error',
            text: `${obj} ${status ? 'berhasil' : 'gagal'} ${text}!`,
            status,
        },
    });
    window.dispatchEvent(event);
}
