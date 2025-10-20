<?php

namespace App\Controller;

use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Document\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class AuthController extends AbstractController
{
    public function __construct(
        private readonly DocumentManager $documentManager
    ) {}

    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render("login.html.twig");
    }

    #[Route('/homepage', name: 'homepage')]
    public function homepage(): Response
    {
        $user = $this->getUser();
        if (!$user)
            return $this->redirectToRoute('index');
        return $this->render("homepage.html.twig", ["user" => $user]);
    }

    #[Route('/userslist', name: 'users_list')]
    public function usersList(): Response
    {
        return $this->render("users-list.html.twig");
    }

    #[Route('/api/userslist', name: 'api_users_list', methods: ['POST'])]
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
        if($user->isEnabled())
            $user->setEnabled(false);
        else
            $user->setEnabled(true);
        $this->documentManager->persist($user);
        $this->documentManager->flush();
        return $this->json($user);
    }

    #[Route('/api/registration', methods: ['POST'])]
    public function createUser(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        Security $security
    ): JsonResponse {
        try {
            $data = $request->getPayload();
            $user = null;
            if($this->documentManager->getRepository(User::class)
                    ->findOneBy(['email' => $data->get('email')]) == null){
                $user = new User();
                $hashedPassword = $passwordHasher->hashPassword(
                    $user,
                    $data->get('plainPassword')
                );
                $user->setName($data->get('name'))
                    ->setSurname($data->get('surname'))
                    ->setEmail($data->get('email'))
                    ->setPassword($hashedPassword);

                $this->documentManager->persist($user);
                $this->documentManager->flush();
            }
            if($user != null){
                $security->login($user);
                return $this->json([
                    'message' => 'Utente creato correttamente',
                    'user' => $user->getUserIdentifier(),
                    'redirect' => $this->generateUrl('homepage')
                ], 201);
            }
            else
                return $this->json(['error' => 'Utente già registrato'], 401);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Errore nella creazione dell account: ' . $e->getMessage()], 400);
        }
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function loginUser(#[CurrentUser] ?User $user): Response
    {
        if ($user === null) {
            return $this->json([
                'message' => 'Credenziali mancanti',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'user'  => $user->getUserIdentifier(),
            'redirect' => $this->generateUrl('homepage')
        ]);
    }

}
