import React, { useRef } from 'react';
import { AlertCircle, Shield, AlertTriangle, FileText } from 'lucide-react';

const Footer = () => {
    const dialogRef = useRef(null);

    return (
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center pb-8">
            <button
                onClick={() => dialogRef.current?.showModal()}
                className="group flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-full bg-gray-50 hover:bg-marine-red/10 dark:bg-gray-800 dark:hover:bg-marine-red/20 transition-all duration-300"
            >
                <AlertCircle size={16} className="text-gray-400 group-hover:text-marine-red transition-colors" />
                <span className="text-sm font-medium text-gray-500 group-hover:text-marine-red dark:text-gray-400 dark:group-hover:text-marine-red transition-colors">
                    Legal Disclaimers & Safety Information
                </span>
            </button>

            <dialog ref={dialogRef} className="bg-white dark:bg-gray-800 p-0 rounded-xl shadow-2xl backdrop:bg-black/60 max-w-lg w-[90%] m-auto border border-gray-100 dark:border-gray-700">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="p-2 bg-marine-red/10 rounded-full">
                            <AlertCircle size={24} className="text-marine-red" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Important Disclaimers</h3>
                        <button
                            onClick={() => dialogRef.current?.close()}
                            className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="space-y-6 text-left overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                        <section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                                <Shield size={16} className="text-marine-green" />
                                Medical Disclaimer
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                The content in this application, including the "Return to Run" program and workout plans, is for educational and informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician, athletic trainer, or other qualified health provider with any questions you may have regarding a medical condition or injury.
                            </p>
                        </section>

                        <section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                                <AlertTriangle size={16} className="text-orange-500" />
                                Liability Waiver
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                By using this application, you agree that you are voluntarily participating in these activities and assume all risks of injury, illness, or death. The developers and creators of this application are not responsible or liable for any claim, loss, or damage resulting from the use of the information contained herein.
                            </p>
                        </section>

                        <section>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                                <FileText size={16} className="text-blue-500" />
                                Official Records & Accuracy
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                This calculator and training tool is designed to assist Marines in preparing for the PFT and CFT. While every effort has been made to align with MCO 6100.13A CH-2, this application is <strong>NOT</strong> an official Marine Corps record system. Scores calculated here are estimates. Always verify your official score potential with your command.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                        <button
                            onClick={() => dialogRef.current?.close()}
                            className="px-6 py-2.5 bg-marine-red text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold shadow-sm hover:shadow-md active:transform active:scale-95"
                        >
                            I Understand & Agree
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Footer;
