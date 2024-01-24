import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

const Select = ({ items, onItemSelected, color }) => {
  const [isActiveSelect, setIsActiveSelect] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName)
    setIsActiveSelect(false)
    onItemSelected(itemName)
  }

  return (
    <div className="relative">
    <button
        role="combobox"
        aria-controls="select-list"
        aria-expanded={isActiveSelect}
        style={{ backgroundColor: color || '#bc95d4' }}
        onClick={() => {
            setIsActiveSelect(!isActiveSelect)
        }}
        aria-haspopup="listbox"
        aria-labelledby="select-label"
        className="flex w-[135px] cursor-pointer items-center rounded-md border-2 border-black bg-[#bc95d4] px-5 py-0.5 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
    >
        <div className="mx-auto flex items-center">
            {selectedItem === null ? 'Sort by' : selectedItem}
            <FaChevronDown
                style={{ transform: `rotate(${isActiveSelect ? '180deg' : '0'})` }}
                className={'ml-3 h-4 w-4 transition-transform ease-in-out'}
            />
        </div>
    </button>
      <ul
        id="select-list"
        style={{
          top: isActiveSelect ? '45px' : '40px',
          opacity: isActiveSelect ? '1' : '0',
          visibility: isActiveSelect ? 'visible' : 'hidden',
        }}
        role="listbox"
        aria-labelledby="select-label"
        className="absolute left-0 top-[70px] w-[200px] rounded-md border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        {items.map((item, index) => {
          return (
            <li
              key={index}
              style={{ backgroundColor: color || '#bc95d4' }}
              onClick={() => {
                handleItemClick(item)
              }}
              className="block w-full border-b-2 border-black bg-[#bc95d4] px-5 py-3 first:rounded-t-[5px] last:rounded-b-[5px] hover:bg-[#a36ec4]"
            >
              {item}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Select