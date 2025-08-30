import React from 'react';

const Modal = ({isOpen = false,
    onClose,
    title, 
    hideHeader,
    showActionBtn,
    actionBtnIcon = null,
    actionBtnText,
    onActionClick,
    children}) => {
        if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center w-full h-full justify-center bg-black/40 '>
      {/*modal cntent*/}
      <div className={'relative flex flex-col bg-white rounded-lg shadow-lg overflow-hidden'}>
        {/*modal header*/}
        {!hideHeader && (
            <div className='flex items-center justify-between p-4 border-b border-gray-200'>
                <h3 className='md:text-lg font-medium text-gray-900'>{title}</h3>

                {showActionBtn && (
                    <button className='btn-small-light mr-12'
                    onClick={ ()=> onActionClick()}
                    >
                        {actionBtnIcon}
                        {actionBtnText}
                    </button>
                )}
            </div>    
        )}

        <button 
            type='button'
            /*at 38:15 */
            className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5'  
            onClick={onClose}
        >
            <svg
                className='w-3 h-3'
                aria-hidden='true'
                xlmns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 14 14'
                >
                    <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M1 1l12 12M13 1L1 13'
                    />
                </svg>
        </button>

        {/*modal body*/}
        <div className='flex-1 overflow-y-auto custom-scrollbar p-4'>
            {children}
        </div>

      </div>
    </div>


  );
};

export default Modal;