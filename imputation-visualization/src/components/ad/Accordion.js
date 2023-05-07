import React, { useState } from 'react';

const Accordion = ({ title, content }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="accordion-item">
            <div className="accordion-title">
                <div className="accordion-title-text">{title}</div>
                <div
                    className="accordion-expansion-symbol"
                    onClick={() => setIsActive(!isActive)}>
                    <strong>
                        {isActive ? '-' : '+'}
                    </strong>
                </div>
            </div>
            {isActive && <div className="accordion-content">{content}</div>}
        </div>
    );
};

export default Accordion;