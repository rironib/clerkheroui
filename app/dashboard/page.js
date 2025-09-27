"use client"

import {useUser} from "@clerk/nextjs";

const Page = () => {
    const {isSignedIn, user, isLoaded} = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    if (!isSignedIn) {
        return <div>Sign in to view this page</div>
    }

    console.log(user?.publicMetadata)

    return (
        <div>
            Hello {user.firstName}!
        </div>
    );
};

export default Page;