
/*import React from 'react';
import { useApp } from '../hooks/useApp';
import { UserRole } from '../types';

const RoleSwitcher: React.FC = () => {
    const { role, setRole } = useApp();

    // The login system is the primary way to become an admin.
    // This switcher is simplified for development/demo purposes.
    const roles = [UserRole.Visitor, UserRole.Admin];

    return (
        <div className="fixed bottom-4 right-4 bg-base-100 p-3 rounded-lg shadow-2xl border z-50">
            <h4 className="text-sm font-bold mb-2 text-text-primary">Switch Role (Dev)</h4>
            <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2 border rounded-md bg-base-100 text-text-primary focus:ring-primary focus:border-primary"
            >
                {roles.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </select>
            <p className="text-xs text-text-secondary mt-2">Use login for normal flow.</p>
        </div>
    );
};

export default RoleSwitcher;*/