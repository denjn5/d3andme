<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Network Force Viz</title>
    <script type="text/javascript" src="resource/jquery-3.0.0.min.js"></script>
    <script type="text/javascript" src="resource/d3.js"></script>
    <link rel="stylesheet" href="app/family.css" />
</head>
<body>
	%if name == 'World':
		<h1>Hello {{name}}!</h1>
		<p>Welcome to project d3andme.</p>
	%else:
		<h1>Hello {{name.title()}}!</h1>
		<p>Welcome to project d3andme!</p>
	%end


    <font class="bodyText">Colored by Database.</font>
    <svg class="force"></svg>

    <script type="text/javascript" src="app/d3_force.js"></script>

</body>
</html>
