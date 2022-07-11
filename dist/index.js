// Make the DIV element draggable:
dragElement(document.getElementById("light"));

//output styles
outputStyles = {
    boxShadow: ''
}

function dragElement(elmnt) {
  let final = {x: 0, y: 0}, 
  initial = {x: 0, y: 0},
  centerPoint = {
      x: window.innerWidth/2,
      y: window.innerHeight/2
  }
  
  document.getElementById("light-handle").onmousedown = dragMouseDown;

  function dragMouseDown() {
    e = window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    initial.x = e.clientX;
    initial.y = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag() {
    e = window.event;
    e.preventDefault();
    // calculate the new cursor position:
    final.x = initial.x - e.clientX;
    final.y = initial.y - e.clientY;
    initial.x = e.clientX;
    initial.y = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - final.y) + "px";
    elmnt.style.left = (elmnt.offsetLeft - final.x) + "px";

    applyNeumorphicEffect();
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function applyNeumorphicEffect(){
      const coordinates = {
          x: initial.x - centerPoint.x,
          y: centerPoint.y - initial.y
      }
      //using the x and y coordinates of the light-source, calculate the angle using arctan
      const angleRad = Math.atan2(coordinates.y, coordinates.x)
      const staticCoordinates = {
          x: 30*Math.cos(angleRad),
          y: 30*Math.sin(angleRad)
      }
      const s = boxShadowParameters(staticCoordinates);

      //set neumorphic element style 'box-shadow' using the angle
      document.querySelectorAll('.neumorphic').forEach(element => {
          boxShadow = `${s.shadow.x}px ${s.shadow.y}px 60px #acbce6, ${s.highlight.x}px ${s.highlight.y}px 60px #fff, inset ${s.insetHighlight.x}px ${s.insetHighlight.y}px 15px #e6edfa`
          element.style = `box-shadow: ${boxShadow}`;
          document.querySelector('#box-shadow-value').innerText = boxShadow;
      })
  }

//get box shadow parameters using coordinate, intensity and size
  function boxShadowParameters(coordinates, intensity = 1, size){
      return {
        highlight: {
            x: Math.floor(coordinates.x * intensity),
            y: Math.floor(coordinates.y * intensity)*-1
        },
        shadow: {
            x: Math.floor(coordinates.x * intensity)*-1,
            y: Math.floor(coordinates.y * intensity)
        },
        insetHighlight: {
            x: Math.floor(coordinates.x * intensity)*-1,
            y: Math.floor(coordinates.y * intensity)
        }
      }
  }
}