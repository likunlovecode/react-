import React from 'react';
import { Alert } from 'reactstrap';

export function NotFound() {
    return (
        <Alert color="danger">
            <p><strong>Error [404]</strong>: {window.location.pathname} 页面不存在.</p>
        </Alert>
    );
}
