import React from "react";
import Map from "src/components/Map";

export default (function(){
	google.load("visualization", "1", {
		packages:["geochart"],
		callback:function(){
			React.render(<div>Hello World!<Map></Map></div>,document.getElementById('wrapper'));			
    	}
    });
})();
