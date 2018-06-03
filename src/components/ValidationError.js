import React from 'react';

const ValidationError = ({ invalid, message }) => {
    return (
        <div>
            {invalid &&
                <span>{message}</span>
            }
        </div>
    );
}

export default ValidationError;
