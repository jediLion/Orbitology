var CallCount = 0

function do_xyzllh() {
    var ecef = new Array(3);
    var llh = new Array(3);
    var latitude,longitude,height;
    var x,y,z;
    var sans;
    
    var dtr = Math.PI/180;
    
    CallCount = CallCount + 1;
    
    x = document.io.form.X.value;
    y = document.io.form.Y.value;
    z = document.io.form.Z.value;
    
    //Forms return string variables
    //may or may not convert automatically in math use
    
    x = Number(x);
    y = Number(y);
    z = Number(z);
    
    good = goodnum(x) && goodnum(y) && goodnum(z);
    
    if ( !good ) sans = sans+"\nInvalid Numeric Input \n"
    
    if ( good ) {
        sans = " \n";
        
        ecef[0] = x;
        ecef[1] = y;
        ecef[2] = z;
        llh     = xyzllh(ecef);
        
        latitude    = llh[0];
        longitude   = llh[1];
        hkm         = llh[2];
        height      = 1000.0 * hkm;
        
        latitude    = fformat(latitude,5);
        longitude   = fformat(longitude,5);
        height      = fformat(height,1);
        
        sans = sans + "Latitude, Longitude, Height (ellipsoidal) from ECEF\n";
        sans = sans + "\n"
        sans = sans + "Latitude: " + latitude + " deg N\n";
        sans = sans + "Height: " + hkm + " km\n";
        
        
    }
    
    document.io.form.text_area.value = sans;
    
    return false;
}

//<input type="submit" value="ECEF to LLH" onclick="do_xyzllh()"