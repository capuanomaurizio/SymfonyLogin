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

    #[Route('/auth/registration', methods: ['POST'])]
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
                    ->setPassword($hashedPassword)
                    ->setRoles(['BASE_USER']);

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

    #[Route('/auth/login', name: 'api_login', methods: ['POST'])]
    public function loginUser(#[CurrentUser] ?User $user): Response
    {
        if ($user === null) {
            return $this->json([
                'error' => 'Credenziali mancanti',
            ], Response::HTTP_UNAUTHORIZED);
        }

        if(in_array("UNABLED_USER", $user->getRoles())){
            return $this->json([
                'error' => 'Utente disabilitato',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'user'  => $user->getUserIdentifier(),
            'messahe' => 'Login effettuato!',
            'redirect' => $this->generateUrl('users_list')
        ]);
    }

}
