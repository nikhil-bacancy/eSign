import singleSort from "./SortArrayWithSingleVal";

// import React from 'react'

export default function SortArrayWithMultiVal() {
    var props = arguments;
    return (obj1, obj2) => {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */

        while (result === 0 && i < numberOfProperties) {
            result = singleSort.dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}
