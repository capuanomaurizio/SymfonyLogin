<?php

declare(strict_types=1);

namespace App\Controller;

use App\Document\Component;
use App\Document\Process;
use App\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class ApiController extends AbstractController
{

    public function __construct(
        private readonly DocumentManager $documentManager,
        private readonly SerializerInterface $serializer
    ) {}

    #[Route('/api/userslist', methods: ['POST'])]
    public function getUsersList(): JsonResponse
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

    #[Route('/api/processesList', methods: ['POST'])]
    public function getProcessesList(): JsonResponse
    {
        $processes = $this->documentManager->getRepository(Process::class)->findAll();
        return $this->json($this->serializer->serialize($processes, 'json', ['groups' => ['process:read']]));
    }

    #[Route('/api/createProcess', methods: ['POST'])]
    public function createProcess(Request $request): Response
    {
        $data = $request->getPayload();
        $process = (new Process())->setName($data->get('name'));
        $this->documentManager->persist($process);
        $this->documentManager->flush();
        return $this->json([
            'redirect' => $this->generateUrl('process_route', ['id' => $process->getId()]),
        ]);
    }

    #[Route('/api/editProcess', methods: ['POST'])]
    public function editProcess(Request $request): Response
    {
        $data = $request->getPayload();
        $process = $this->documentManager->getRepository(Process::class)->findOneBy(['id' => $data->get('id')]);
        $process->setName($data->get('new_name'));
        $this->documentManager->persist($process);
        $this->documentManager->flush();
        return $this->json([]);
    }

    #[Route('/api/deleteProcess', methods: ['POST'])]
    public function deleteProcess(Request $request): Response
    {
        $data = $request->getPayload();
        $process = $this->documentManager->getRepository(Process::class)->findOneBy(['id' => $data->get('id')]);
        $this->documentManager->remove($process);
        $this->documentManager->flush();
        return $this->json([]);
    }

    #[Route('/api/createComponent', methods: ['POST'])]
    public function createComponent(Request $request): Response
    {
        $data = $request->getPayload();
        $parentComponent = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data->get('parent_id')]);
        $component = (new Component())->setName($data->get('name'))->setParentComponent($parentComponent);
        $parentComponent->addChildComponent($component);
        $this->documentManager->persist($component);
        $this->documentManager->persist($parentComponent);
        $this->documentManager->flush();
        return $this->json([]);
    }

    #[Route('/api/editComponent', methods: ['POST'])]
    public function editComponent(Request $request): Response
    {
        $data = $request->getPayload();
        $component = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data->get('id')]);
        $component->setName($data->get('new_name'));
        $this->documentManager->persist($component);
        $this->documentManager->flush();
        return $this->json([]);
    }
}

