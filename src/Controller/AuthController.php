<?php

namespace App\Controller;

use App\Service\UsersManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    public function __construct(
        private UsersManager $usersManager
    ) {}

    #[Route('/', name: 'homepage')]
    public function homepage(#[Autowire(param: 'kernel.project_dir')] string $projectDir): Response
    {
        $html = file_get_contents($projectDir . '/public/index.html');
        return new Response($html, status: 200, headers: ['Content-Type' => 'text/html']);
    }

    private function successResponse($data, int $status = 200): JsonResponse
    {
        return $this->json(['success' => true, ...$data], $status);
    }

    private function errorResponse(string $message, int $status = 400): JsonResponse
    {
        return $this->json(['success' => false, 'message' => $message], $status);
    }

    #[Route('/api/form/registration', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        try {
            $data = $request->getPayload();
            $user = $this->usersManager->createUser(
                $data->get('name'),
                $data->get('surname'),
                $data->get('email'),
                $data->get('password')
            );

            if($user != null)
                return $this->successResponse([
                    'message' => 'User created successfully',
                    'userId' => $user->getId()
                ], 201);
            else
                return $this->errorResponse('Error creating account: the user already exists');
        } catch (\Exception $e) {
            return $this->errorResponse('Error creating account: ' . $e->getMessage());
        }
    }

    #[Route('/api/form/login', methods: ['POST'])]
    public function loginUser(Request $request): JsonResponse
    {
        try {
            $data = $request->getPayload();
            $user = $this->usersManager->checkUserCredentials(
                $data->get('email'),
                $data->get('password')
            );

            if($user != null)
                return $this->successResponse([
                    'message' => 'User created successfully',
                    'userId' => $user->getId()
                ], 201);
            else
                return $this->errorResponse('Error authenticating: wrong credentials');
        } catch (\Exception $e) {
            return $this->errorResponse('Error creating account: ' . $e->getMessage());
        }
    }

}