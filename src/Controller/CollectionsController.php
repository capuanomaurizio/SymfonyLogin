<?php

declare(strict_types=1);

namespace App\Controller;

use App\Document\Collection;
use App\Service\DynamicUserDatabaseManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CollectionsController extends AbstractController
{

    public function __construct(
        private readonly DynamicUserDatabaseManager $dbManager
    ){}

    #[Route('/collections')]
    public function index(): Response
    {
        $repo = $this->dbManager->getManagerForCurrentUser()->getRepository(Collection::class);
        $coll = $repo->findAll();
        dump($this->dbManager->getManagerForCurrentUser());
        dump($coll);
        exit;

        return $this->render('base.html.twig');
    }

}
