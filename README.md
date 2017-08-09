# treegen
    An L-system consists of an alphabet of symbols that can be used to make strings, a collection of production rules that expand each symbol into some larger string of symbols, an initial "axiom" string from which to begin construction, and a mechanism for translating the generated strings into geometric structures.
    This project uses L-Dystems to generate trees. You can go ahead and experiment to make other designs as well. The L-System defined here has 5 letters in its alphabet.
    Initial direction : upwards.
    Initial position : canvas bottom center
    F - moves forward in desired angle by specified length. 
    + - turns right by desired angle
    - - turns left by desired angle
    [ - saves current orientation
    ] - returns to last saved orientation
    
    Sample :
    FF : will move two steps forward.
    FF+F : will move forward two steps, turn right and move forward in that direction.
    FF[+F]-F : will move forward two steps, save orientation, say A. Turns right and moves forward. Returns to A. Turns left and moves forward.
    
    Try out the other sample ideas and you can save rules too.
    
    Simply git clone and open treegen.html to try it out.
