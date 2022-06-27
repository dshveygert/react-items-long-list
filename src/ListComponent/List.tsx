import React, { useState, useEffect, useRef } from "react";
import './List.css';
import ListItem from "./ListItem";

interface IDataValue {
    id: number;
    value: string;
}

const List = () => {
    const listId = 'list';
    const listLength = 10000;
    const list: IDataValue[] = Array.from({length: listLength}, (_, i) => ({id: i, value: `element ${i + 1}`}));
    const extraItemCounts = 1.5;

    const [listOfItems, setListOfItems] = useState(list.slice(0, 5));
    const prevScrollY = useRef(0);
    const prevScrollYBreakpoint = useRef(0);
    const currentStepRef = useRef(0);
    const visibleItemsCounterRef = useRef(5);
    const listOfItemsRef = useRef(list.slice(0, 5));

    const updateItems = (indexToAdd: number, positionToAdd: 'start' | 'end' = 'end', positionToRemove: 'start' | 'end' | null = null): void => {
        const listOfItems = listOfItemsRef.current;
        const l =  [...listOfItems];
        if (positionToAdd === 'end') {
            l.push(list[indexToAdd]);
        } else {
            l.unshift(list[indexToAdd]);
        }
        if (positionToRemove === 'end') {
            l.pop();
        } else if (positionToRemove === 'start') {
            l.shift();
        }
        listOfItemsRef.current = l;
        setListOfItems(l);
    }


    const calculateItemHeight = (el: HTMLElement): number => {
        const height = el?.offsetHeight ?? 100;
        const style = el ? getComputedStyle(el) : {marginTop: '0', marginBottom: '0'};
        const marginTop = parseInt(style.marginTop);
        const marginBottom = parseInt(style.marginBottom);
        return height + marginTop + marginBottom;
    }

    const updateItemList = (status: 'up' | 'down'): void => {
        const currentStep = currentStepRef.current;
        const visibleItemsCounter = visibleItemsCounterRef.current;
        let newCurrentStep = currentStep;
        if (status === 'down' && currentStep < listLength - visibleItemsCounter) {
            newCurrentStep = currentStep + 1;
            updateItems(newCurrentStep + visibleItemsCounter - 1, 'end', currentStep > visibleItemsCounter ? 'start' : null);
        } else if (status === 'up' && currentStep > visibleItemsCounter + 1) {
            newCurrentStep = currentStep - 1;
            updateItems(currentStep - visibleItemsCounter - 2, 'start', currentStep > visibleItemsCounter ? 'end' : null);
        }
        currentStepRef.current = newCurrentStep;
    }

    useEffect(() => {
        const listElement = document?.getElementById(listId);
        const height = listElement?.clientHeight ?? 100;
        const iHeight = calculateItemHeight(listElement?.getElementsByClassName('list-item')[0] as HTMLElement);
        const numberOfVisibleItems = Math.ceil(height * extraItemCounts / iHeight);

        setListOfItems(list.slice(0, numberOfVisibleItems));
        visibleItemsCounterRef.current = numberOfVisibleItems;
        listOfItemsRef.current = list.slice(0, numberOfVisibleItems);

        const handleScroll = () => {
            const currentScrollY = listElement?.scrollTop ?? 0;
            if (prevScrollY.current < currentScrollY) {
                // Scrolling down
                if (currentScrollY - prevScrollYBreakpoint.current > 2 * iHeight) {
                    updateItemList('down');
                    prevScrollYBreakpoint.current = 0;
                }
            } else {
                // Scrolling up

            }
            prevScrollY.current = currentScrollY;
        }
        listElement?.addEventListener("scroll", handleScroll);
        return () => {
            listElement?.removeEventListener("scroll", handleScroll);
        }
    }, []);

    const listItem = (item: IDataValue) => <div key={item.id} className='list-item'>#{item.id}<div>{item.value}</div><ListItem/></div>;
    const listItems = listOfItems.map(id => listItem(id));

    return (
        <div className="list" id="list">
            {listItems}
        </div>
    );
}

export default List;
