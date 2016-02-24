var VSHADE_SOURCE = 
	' attribute vec4 a_Position;\n' +
	' attribute vec4 a_Normal;\n' +
	'  \n'

var FSHADE_SOURCE = 
	'	\n'

function main(){
	var canvas = document.getElementById('webgl');
	var gl = getWebGlContext(canvas);
	if (!gl){
		console.log('Failed to retrieve the webgl context for canvas');
	}





	return 0
}