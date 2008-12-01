function check_file () {
	var nzbregex = /\.nzb$/;
	if ($F('nzbfile').match( nzbregex )) {
		return true;
	}
	else {
		alert("incorrect file type!");
		return false;
	}
}

