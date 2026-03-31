import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger" // danger, warning, info
}) => {
    if (!isOpen) return null;

    return (
        <div className="cm-overlay">
            <div className="cm-modal animate-pop-in">
                <button className="cm-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="cm-content">
                    <div className={`cm-icon-wrapper ${type}`}>
                        <AlertTriangle size={32} />
                    </div>

                    <h3 className="cm-title">{title}</h3>
                    <p className="cm-message">{message}</p>
                </div>

                <div className="cm-footer">
                    <button className="cm-btn cancel" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button className={`cm-btn confirm ${type}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
