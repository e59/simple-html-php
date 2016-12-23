<?php
use Dotenv\Dotenv;

require dirname(__DIR__) . '/vendor/autoload.php';

$env = new Dotenv(dirname(__DIR__));
$env->load();


$defaults = [
    'assets' => getenv('assets') ?: 'http://127.0.0.1:8080',
    'root' => getenv('root') ?: dirname($_SERVER['PHP_SELF']),
];

$defaults['appTitle'] = getenv('apptitle') ?: ucfirst(trim(pathinfo($defaults['root'], PATHINFO_DIRNAME), '/'));

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) use ($defaults) {
    $r->addRoute('GET', '/', function() {});

    $r->addRoute('GET', '/{tpl}', function() {});
});

// Fetch method and URI from somewhere
$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = str_replace($defaults['root'], '', $_SERVER['REQUEST_URI']);

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        die('404');
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        die('405');
        break;
    case FastRoute\Dispatcher::FOUND:

        $templates = new League\Plates\Engine(dirname(__DIR__) . DIRECTORY_SEPARATOR . '/src/templates');
        $templates->setFileExtension('phtml');
        $templates->addData($defaults);

        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        if (!$vars) {
            $vars = ['home'];
        }

        echo $templates->render(current($vars));
        break;
}
