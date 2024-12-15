import React from "react";

export default function Calender(props) {
  return (
    <iframe
      src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=UTC&bgcolor=%23009688&showTitle=0&src=YmV2YXpoZWt1amFAZ21haWwuY29t&src=aWQuaW5kb25lc2lhbiNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23039BE5&color=%230B8043"
      //style={{ border: "solid 1px #777" }}
      //width={800}
      //height={600}
      //frameBorder={0}
      //scrolling="no"
      {...props}
    />
  );
}
