import useLoginModal from "@/hooks/useLoginModal";
import React, { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { signIn } from "next-auth/react";

const LoginModal = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            await signIn("credentials", {
                email,
                password
            })
            loginModal.onClose();
        } catch(error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [loginModal, email, password]);

    const onToggle = useCallback(() => {
        if(isLoading) {
            return;
        }
        loginModal.onClose();
        registerModal.onOpen();
    }, [isLoading, loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={isLoading}
            />
            <Input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={isLoading}
            />

        </div>
    );

    const footerContent = (
        <div className="text-neutral-400 text-center mt-4">
            <p>First time using Twitter?  
                <span 
                    onClick={onToggle}
                    className="text-white cursor-pointer hover:underline"> Create an account
                </span>
            </p>
        </div>        
    );

    return (
        <Modal 
            disabled={isLoading}
            title="Login"
            actionLabel={isLoading ? "Loading..." : "Sign in"}
            isOpen={loginModal.isOpen}
            onClose={loginModal.onClose}
            onSubmit={handleSubmit}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModal;