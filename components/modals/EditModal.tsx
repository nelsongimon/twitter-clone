import React, { useCallback, useEffect, useState } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import useEditModal from '@/hooks/useEditModal';
import useUser from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Modal from '../Modal';
import Input from '../Input';
import ImageUpload from '../ImageUpload';

const EditModal = () => {
    const { data: currentUser } = useCurrentUser(); 
    const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
    const editModal = useEditModal();

    const [profileImage, setProfileImage] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        setProfileImage(currentUser?.profileImage);
        setCoverImage(currentUser?.coverImage);
        setName(currentUser?.name);
        setUsername(currentUser?.username);
        setBio(currentUser?.bio);
    }, [currentUser]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch('/api/edit', {
                id: currentUser?.id,
                name,
                username,
                bio,
                profileImage,
                coverImage
            });
            console.log(response);
            mutateFetchedUser();
            toast.success('Profile updated successfully');
            editModal.onClose();
        } catch(error) {
            console.log(error);
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false);
        }
    }, [editModal, name, username, bio, profileImage, coverImage, mutateFetchedUser]); 

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <ImageUpload
                value={profileImage}
                disabled={isLoading}
                onChange={(base64) => setProfileImage(base64)}
                label="Upload profile image"
            />
            <ImageUpload
                value={coverImage}
                disabled={isLoading}
                onChange={(image) => setCoverImage(image)}
                label="Upload cover image"
            />
            <Input 
                placeholder="Name"
                onChange={(e: any) => setName(e.target.value)}
                value={name}
                disabled={isLoading}
            />
            <Input 
                placeholder="Username"
                onChange={(e: any) => setUsername(e.target.value)}
                value={username}
                disabled={isLoading}
            />
            <Input 
                placeholder="Bio"
                onChange={(e: any) => setBio(e.target.value)}
                value={bio}
                disabled={isLoading}
            />
        </div>
    );
    
    return (
        <Modal 
            disabled={isLoading}
            isOpen={editModal.isOpen}
            title="Edit your profile"
            actionLabel={isLoading ? "Loading..." : "Edit"}
            onClose={editModal.onClose}
            onSubmit={handleSubmit}
            body={bodyContent}
        />
    );
}

export default EditModal;