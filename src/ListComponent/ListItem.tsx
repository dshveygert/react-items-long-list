import React from "react";

function factorial(n: number): number {
    return (n !== 1) ? n * factorial(n - 1) : 1;
}

const ListItem = () => {
    const n = Math.floor(Math.random() * 20) + 1;
    const text: string = `${factorial(n)} = ${n}!`;
    return (
        <div className='list-item-text'>
            {text}
        </div>
    );
}
export default ListItem;
