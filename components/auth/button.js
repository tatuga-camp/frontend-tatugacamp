import React, { useState, Fragment } from "react";
import { FcGoogle } from "react-icons/fc";
import { BiLogOutCircle } from "react-icons/bi";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
function AuthButton() {
  const [dropDown, setDropDown] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div>
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <button
          onClick={() => signIn()}
          className="flex gap-x-2 justify-center items-center focus:outline-none text-base font-Inter font-normal border-0 w-max h-auto bg-white  text-black hover:ring-2  transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]"
        >
          <span>Login</span>
          <FcGoogle size={23} />
        </button>
      </div>
    );
  }

  const handleDropDown = () => {
    setDropDown((prev) => !prev);
  };

  return (
    <Menu>
      <Menu.Button
        className="flex bg-transparent relative border-0 cursor-pointer 
    hover:ring-2 rounded-md p-3 ring-orange-400 active:ring-4 
    items-center justify-center gap-x-3"
      >
        <span className="text-black text-sm h-min flex flex-col justify-center items-center gap-y-0  ">
          welcome
          <span className="first-letter:uppercase font-semibold text-white md:text-orange-400 ">
            {session.user.name}
          </span>
        </span>

        <Image
          src={session.user.image}
          alt={session.user.name}
          width={35}
          height={35}
          className="rounded-full"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items>
          <Menu.Item>
            {({ active }) => (
              <ul
                role="button"
                onClick={() => signOut()}
                className="list-none bg-white rounded-md text-center drop-shadow-md p-2 md:absolute ml-10 mt-2 
        md:right-10 md:top-26 w-max cursor-pointer"
              >
                <div className="arrow-left md:arrow-top absolute -left-3 top-auto bottom-auto"></div>
                <li className="flex justify-center items-center text-base font-light gap-x-2">
                  <span>Logout</span>
                  <span className="text-center flex items-center justify-center">
                    <BiLogOutCircle />
                  </span>
                </li>
              </ul>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default AuthButton;
