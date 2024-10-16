// components/ui/modal.js
import React from "react";
import { Dialog } from "@headlessui/react"; // Ensure to install headlessui/react for modal components
import { Button } from "@/components/ui/button";

const Modal = ({ isOpen, onClose, onSubmit, title, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md bg-white rounded p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {children}
          <div className="mt-4">
            <Button onClick={onSubmit}>Submit</Button>
            <Button variant="outline" onClick={onClose} className="ml-2">
              Cancel
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
