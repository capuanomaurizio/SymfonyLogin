<?php

declare(strict_types=1);

namespace App\Controller;

use App\Document\Process;
use App\Document\User;
use App\Service\DynamicUserDatabaseManager;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ApiController extends AbstractController
{

    public function __construct(
        private readonly DocumentManager $documentManager,
        private readonly DynamicUserDatabaseManager $dbManager
    ) {}

    #[Route('/api/userslist', methods: ['POST'])]
    public function getUsersList(): false|JsonResponse
    {
        $users = $this->documentManager->getRepository(User::class)->findAll();
        return $this->json($users);
    }

    #[Route('/api/changeUserStatus', methods: ['POST'])]
    public function changeUserStatus(Request $request): Response
    {
        $data = $request->getPayload();
        $user = $this->documentManager->getRepository(User::class)
            ->findOneBy(['email' => $data->get('email')]);
        $userRoles = $user->getRoles();
        if(in_array("UNABLED_USER", $userRoles)){
            $userRoles = array_filter($userRoles, static function ($delete) {
                return $delete !== "UNABLED_USER";
            });
        } else {
            $userRoles[] = "UNABLED_USER";
        }
        $user->setRoles($userRoles);
        $this->documentManager->persist($user);
        $this->documentManager->flush();
        return $this->json($user);
    }

    #[Route('/api/editUser', methods: ['POST'])]
    public function editUser(Request $request): Response
    {
        $data = $request->getPayload();
        $user = $this->documentManager->getRepository(User::class)
            ->findOneBy(['email' => $data->get('email')]);
        $user->setEmail($data->get('email'))
            ->setName($data->get('name'))
            ->setSurname($data->get('surname'))
            ->setRoles($data->all('roles'));
        $this->documentManager->persist($user);
        $this->documentManager->flush();
        return $this->json($user);
    }

    #[Route('/api/createProcess', methods: ['POST'])]
    public function editComponent(Request $request): Response
    {
        $data = $request->getPayload();
        $process = (new Process())->setName($data->get('name'));
        $this->dbManager->getManagerForCurrentUser()->persist($process);
        $this->dbManager->getManagerForCurrentUser()->flush();
        return $this->redirectToRoute('process_route', [
            'id' => $data->get('id'),
        ]);
    }
}
