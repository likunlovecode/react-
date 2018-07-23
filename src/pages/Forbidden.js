import React from 'react';
import { Alert } from 'reactstrap';

export function Forbidden() {
    return (
        <Alert color="danger">
            <p><strong>Error [403]</strong>: 权限不足</p>
        </Alert>
    );
}
