<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CollectionsController extends AbstractController
{

    #[Route('/collections/processes')]
    public function processesList(): Response
    {
        return $this->render('processes.html.twig');
    }

    #[Route('/collections/process/{id}', name: 'process_route')]
    public function processTree(string $id): Response
    {
        return $this->render('process-tree.html.twig', ['processId' => $id]);
    }

    #[Route('/collections/initialize')]
    public function initialize(): Response
    {
        /*$comp1 = (new Component())->setName("componente1");

        $comp11 = (new Component())->setName("componente11");
        $comp12 = (new Component())->setName("componente12");
        $comp13 = (new Component())->setName("componente13");
        $comp14 = (new Component())->setName("componente14");

        $comp111 = (new Component())->setName("componente111");
        $comp112 = (new Component())->setName("componente112");

        $comp131 = (new Component())->setName("componente131");
        $comp132 = (new Component())->setName("componente132");
        $comp133 = (new Component())->setName("componente133");

        $comp141 = (new Component())->setName("componente141");

        $comp1->addChildComponent($comp11);
        $comp1->addChildComponent($comp12);
        $comp1->addChildComponent($comp13);
        $comp1->addChildComponent($comp14);
        $comp11->setParentComponent($comp1);
        $comp12->setParentComponent($comp1);
        $comp13->setParentComponent($comp1);
        $comp14->setParentComponent($comp1);

        $comp11->addChildComponent($comp111);
        $comp11->addChildComponent($comp112);
        $comp111->setParentComponent($comp11);
        $comp112->setParentComponent($comp11);

        $comp13->addChildComponent($comp131);
        $comp13->addChildComponent($comp132);
        $comp13->addChildComponent($comp133);
        $comp131->setParentComponent($comp13);
        $comp132->setParentComponent($comp13);
        $comp133->setParentComponent($comp13);

        $comp14->addChildComponent($comp141);
        $comp141->setParentComponent($comp14);


        $proc = (new Process())->setName("primoProcesso");
        $proc->setComponent($comp1);

        $docManager = $this->dbManager->getManagerForCurrentUser();
        $docManager->persist($comp141);
        $docManager->persist($comp133);
        $docManager->persist($comp132);
        $docManager->persist($comp131);
        $docManager->persist($comp112);
        $docManager->persist($comp111);
        $docManager->persist($comp14);
        $docManager->persist($comp13);
        $docManager->persist($comp12);
        $docManager->persist($comp11);
        $docManager->persist($comp1);
        $docManager->persist($proc);
        $docManager->flush();*/

        return $this->render('base.html.twig');
    }

}
