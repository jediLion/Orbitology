
  function  fformat ( number,dplaces)
     {
          var    duse,scale,nuse, nnew

          duse  = Math.floor( dplaces )
          scale = Math.pow( 10, duse )
          nuse  = scale * number
          nuse  = Math.round(nuse)
          nnew  = nuse / scale
          return ( nnew )
     }

//        ====================================================

     function goodnum (value)
     {
          var   ret

          ret  = isFinite(value);
          return ret;

     }