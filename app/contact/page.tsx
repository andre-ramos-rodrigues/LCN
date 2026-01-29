'use client'

import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';

const ContactPage: React.FC = () => {
    const { addMessage } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMessage({ name, email, message });
        setIsSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold text-text-primary mb-4 text-center">Envie sua mensagem</h1>
            <p className="text-lg text-text-secondary text-center mb-8">
                Tem uma pergunta ou deseja agendar uma sessão? Preencha o formulário abaixo.
            </p>

            {isSubmitted ? (
                <div className="p-6 bg-emerald-50 text-emerald-800 rounded-lg text-center">
                    <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                    <p>Mensagem enviada</p>
                </div>
            ) : (
                <div className="bg-base-100 p-8 rounded-lg shadow-lg border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Nome</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-base-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-base-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-text-secondary">Mensagem</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={5}
                                className="mt-1 block w-full px-3 py-2 bg-base-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ContactPage;