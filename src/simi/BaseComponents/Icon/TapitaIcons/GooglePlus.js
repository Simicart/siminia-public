import React from 'react'
import Abstract from './Abstract'

class GooglePlus extends Abstract {
    render() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg"
                 style={this.style}
                 className={this.className}
                 viewBox="0 -91 512 512">
                <path
                    d="m166 60c34.667969 0 66.027344 17.789062 84 42.300781l42.597656-42.902343c-25.476562-33.128907-74.511718-59.398438-126.597656-59.398438-91.199219 0-166 73.800781-166 165s74.800781 165 166 165c75.601562 0 139.199219-50.699219 158.699219-120 4.199219-14.402344 6.300781-29.402344 6.300781-45v-15h-150v59.988281h79.5c-16.5 35.402344-52.800781 60.011719-94.5 60.011719-57.898438 0-106-47.101562-106-105s48.101562-105 106-105zm0 0"/>
                <path d="m466 90h-60v45h-45v60h45v45h60v-45h46v-60h-46zm0 0"/>
            </svg>
        )
    }
}

export default GooglePlus