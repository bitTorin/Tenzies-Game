import React from "react";

export default function Die(prop) {
    return (
        <div className="die">
            <h2 className="dieNum">{prop.value}</h2>
        </div>
    )
}