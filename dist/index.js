//setup onmousedown event
const lightSource = document.getElementById('light');
const subject = document.getElementById('subject');

dragElement(lightSource, applyNeumorphism(subject, 2, 1, '#9dadd8', '#fff', '#fff'))

// Make element draggable. SideEffect is then returned as a callback function
function dragElement(element, sideEffect){ 
    element.addEventListener('mousedown', addDragEvent)

    function addDragEvent(event){
        event.preventDefault();
    
        let 
        element = event.target,
        position = {
            x: event.clientX,
            y: event.clientY
        }
    
        document.onmousemove = updatePosition;
        document.onmouseup = cancelDrag;
    
        // calculate and set using the new cursor position:
        function updatePosition({ clientX, clientY }){
            let newPosition = {
                x: position.x - clientX,
                y: position.y - clientY
            }
    
            //set position to cursor position
            position.x = clientX;
            position.y = clientY;
    
            // set the element's new position:
            element.style.top = (element.offsetTop - newPosition.y) + "px";
            element.style.left = (element.offsetLeft - newPosition.x) + "px";

            //fire the sideEffect callback
            return sideEffect(element, position)
        }
    
        // stop moving when mouse button is released:
        function cancelDrag() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

// centerElement will be the reference (0, 0) where shadow angles will be calculated
function applyNeumorphism(centerElement, intensity, size, shadowColor, highlightColor, shineColor){
    
    return function (lightElement, lightPosition){
        const centerPoint = getCenterPoint(centerElement);
        const angleRad = getAngle(centerPoint, lightPosition);
        const coordinates = getCoordinates(angleRad, 30);
        const boxShadow = createBoxShadow(coordinates, intensity, size, shadowColor, highlightColor, shineColor);

        //apply box shadow
        applyBoxShadow(centerElement, boxShadow)
    }

    function getCenterPoint(element){
        let c = element.getBoundingClientRect()
        return {
            x: (c.left + c.right) / 2,
            y: (c.top + c.bottom) / 2
        }
    }

    function getAngle(center, point){
        return Math.atan2((center.y - point.y), (point.x - center.x))
    }

    function getCoordinates(angle, radius){
        return {
            x: radius*Math.cos(angle),
            y: radius*Math.sin(angle)
        }
    }

    function createBoxShadow(coordinates, intensity, size, shadowColor, highlightColor, shineColor){
        const parameters = {
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
        return `${parameters.shadow.x}px ${parameters.shadow.y}px 60px 0px ${shadowColor}, ${parameters.highlight.x}px ${parameters.highlight.y}px 60px 0px ${highlightColor}, inset ${parameters.insetHighlight.x}px ${parameters.insetHighlight.y}px 15px 0px ${shineColor}`
    }

    function applyBoxShadow(element, boxShadow){
        element.style.boxShadow = boxShadow;
    }  
}