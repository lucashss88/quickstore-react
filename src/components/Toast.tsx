interface Toast {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
}

function Toast({show, message, type, onClose}: Toast) {
    if (!show) return null;

    return (
        <div className="toast-container position-fixed top-0 end-0 p-3">
            <div
                className={`toast bg-${type} text-white border-0 fade show`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="toast-header">
                    <strong className="me-auto">Notificação</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={onClose}></button>
                </div>
                <div className="toast-body">
                    {message}
                </div>
            </div>
        </div>
    );
}

export default Toast;