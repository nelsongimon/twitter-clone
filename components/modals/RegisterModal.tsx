import React, { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import { signIn } from "next-auth/react";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";
import axios from "axios";
import { toast } from "react-hot-toast";

const RegisterModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            await axios.post("/api/register", {
                email,
                password,
                username,
                name,
            });
            toast.success("Account created.");
            signIn("credentials", {
                email,
                password
            });
            registerModal.onClose();
        } catch(error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }, [registerModal, email, password, username, name]);

    const onToggle = useCallback(() => {
        if(isLoading) {
            return;
        }
        registerModal.onClose();
        loginModal.onOpen();
    }, [isLoading, registerModal, loginModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={isLoading}
            />
            <Input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={isLoading}
            />
            <Input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
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
            <p>Already have an account?  
                <span 
                    onClick={onToggle}
                    className="text-white cursor-pointer hover:underline"> Sign in
                </span>
            </p>
        </div>
    );

    return (
        <Modal 
            disabled={isLoading}
            title="Create an account"
            actionLabel={isLoading ? "Loading..." : "Register"}
            isOpen={registerModal.isOpen}
            onClose={registerModal.onClose}
            onSubmit={handleSubmit}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default RegisterModal;