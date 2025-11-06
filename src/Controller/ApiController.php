<?php

declare(strict_types=1);

namespace App\Controller;

use App\Document\Component;
use App\Document\Functionality;
use App\Document\Process;
use App\Document\Triplet;
use App\Document\User;
use App\Document\RootRequirement;
use App\Document\FunctionalityRequirement;
use App\Enum\FunctionalityRequirementType;
use App\Enum\RootRequirementType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\MongoDBException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Throwable;

class ApiController extends AbstractController
{

    public function __construct(
        private readonly DocumentManager $documentManager,
        private DocumentManager $defaultDocumentManager,
        private readonly SerializerInterface $serializer
    ) {
        $this->defaultDocumentManager = $this->documentManager->getDefaultManager();
    }

    #[Route('/api/userslist', methods: ['POST'])]
    public function getUsersList(): JsonResponse
    {
        $users = $this->defaultDocumentManager->getRepository(User::class)->findAll();
        return $this->json($users);
    }

    #[Route('/api/changeUserStatus', methods: ['POST'])]
    public function changeUserStatus(Request $request): Response
    {
        $data = $request->getPayload();
        $user = $this->defaultDocumentManager->getRepository(User::class)
            ->findOneBy(['email' => $data->get('email')]);
        dump($user);
        $userRoles = $user->getRoles();
        if(in_array("UNABLED_USER", $userRoles)){
            $userRoles = array_filter($userRoles, static function ($delete) {
                return $delete !== "UNABLED_USER";
            });
        } else {
            $userRoles[] = "UNABLED_USER";
        }
        $user->setRoles($userRoles);
        $this->defaultDocumentManager->persist($user);
        $this->defaultDocumentManager->flush();
        return $this->json($user);
    }

    #[Route('/api/editUser', methods: ['POST'])]
    public function editUser(Request $request): Response
    {
        $data = $request->getPayload();
        $user = $this->defaultDocumentManager->getRepository(User::class)
            ->findOneBy(['email' => $data->get('email')]);
        $user->setEmail($data->get('email'))
            ->setName($data->get('name'))
            ->setSurname($data->get('surname'))
            ->setRoles($data->all('roles'));
        $this->defaultDocumentManager->persist($user);
        $this->defaultDocumentManager->flush();
        return $this->json($user);
    }

    #[Route('/api/processesList', methods: ['POST'])]
    public function getProcessesList(): JsonResponse
    {
        $processes = $this->documentManager->getRepository(Process::class)->findAll();
        return $this->json($this->serializer->serialize($processes, 'json', ['groups' => ['process:read']]));
    }

    #[Route('/api/componentsList', methods: ['POST'])]
    public function componentsList(): JsonResponse
    {
        $components = $this->documentManager->getRepository(Component::class)->findAll();
        return $this->json($this->serializer->serialize($components, 'json', ['groups' => ['process:read']]));
    }

    /**
     * @throws Throwable
     * @throws MongoDBException
     */
    #[Route('/api/createProcess', methods: ['POST'])]
    public function createProcess(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $rootComponent = (new Component())
            ->setName($data['name'])
            ->setIsRoot(true)
            ->setRequirements(new ArrayCollection());
        $process = (new Process())
            ->setName($data['name'])
            ->setComponent($rootComponent);
        $this->documentManager->persist($process);
        $this->documentManager->flush();
        return $this->json([
            'redirect' => $this->generateUrl('process_route', ['id' => $process->getId()]),
        ]);
    }

    /**
     * @throws MongoDBException
     * @throws Throwable
     */
    #[Route('/api/editProcess', methods: ['POST'])]
    public function editProcess(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $values = $data['values'];
        $process = $this->documentManager->getRepository(Process::class)->findOneBy(['id' => $data['id']]);
        $process->setName($values['name'])
            ->setContextInformation($values['contextInformation'])
            ->setExpirationDate(new \DateTime($values['expirationDate']));
        $process->getComponent()->setName($values['name']);
        $this->documentManager->persist($process);
        $this->documentManager->flush();
        return $this->json($process);
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
        $data = json_decode($request->getContent(), true);
        $parentComponent = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data['parentId']]);
        if($parentComponent->isFeature())
            $parentComponent->setIsFeature(false);
        $component = (new Component())
            ->setName($data['values']['name'])
            ->setIsFeature($data['values']['isFeature']);
        $parentComponent->addChildComponent($component);
        $this->documentManager->persist($parentComponent);
        $this->documentManager->flush();
        return $this->json($component);
    }

    #[Route('/api/editComponent', methods: ['POST'])]
    public function editComponent(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $component = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data['id']]);
        $component->setName($data['values']['name']);
        if(isset($data['values']['isFeature']))
            $component->setIsFeature($data['values']['isFeature']);
        $this->documentManager->persist($component);
        $this->documentManager->flush();
        return $this->json([]);
    }

    #[Route('/api/deleteComponent', methods: ['POST'])]
    public function deleteComponent(Request $request): Response
    {
        $data = $request->getPayload();
        $parent = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data->get('parentId')]);
        $child = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data->get('id')]);
        $parent->removeChildComponent($child);
        $this->documentManager->remove($child);
        $this->documentManager->persist($parent);
        $this->documentManager->flush();
        return $this->json([]);
    }

    #[Route('/api/createFunction', methods: ['POST'])]
    public function createFunction(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $component = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data['componentId']]);
        $function = (new Functionality())->setName($data['values']['name']);
        $component->addFunctionality($function);
        $this->documentManager->persist($component);
        $this->documentManager->flush();
        return $this->json($function);
    }

    #[Route('/api/editFunction', methods: ['POST'])]
    public function editFunction(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $values = $data['values'];
        $function = $this->documentManager->getRepository(Functionality::class)->findOneBy(['id' => $data['functionId']]);
        $function->setName($values['name']);
        $this->documentManager->persist($function);
        $this->documentManager->flush();
        return $this->json($function);
    }

    #[Route('/api/deleteFunction', methods: ['POST'])]
    public function deleteFunction(Request $request): Response
    {
        $data = $request->getPayload();
        $component = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data->get('componentId')]);
        $function = $this->documentManager->getRepository(Functionality::class)->findOneBy(['id' => $data->get('functionId')]);
        $component->removeFunctionality($function);
        $this->documentManager->persist($component);
        $this->documentManager->remove($function);
        $this->documentManager->flush();
        return $this->json([]);
    }

    #[Route('/api/createRequirement', methods: ['POST'])]
    public function createRequirement(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $function = $this->documentManager->getRepository(Functionality::class)->findOneBy(['id' => $data['functionalityId']]);
        $requirement = (new FunctionalityRequirement())
            ->setContent($data['values']['content'])
            ->setRequirementType($data['values']['type'] == 'Functional' ?
                FunctionalityRequirementType::FUNCTIONAL : FunctionalityRequirementType::CONTROL_FACTOR);
        $function->addRequirement($requirement);
        $this->documentManager->persist($function);
        $this->documentManager->flush();
        return $this->json($requirement);
    }

    #[Route('/api/editRequirement', methods: ['POST'])]
    public function editRequirement(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $values = $data['values'];
        $requirement = $this->documentManager->getRepository(FunctionalityRequirement::class)->findOneBy(['id' => $data['requirementId']]);
        $requirement->setContent($values['content'])
                    ->setRequirementType($values['type'] == 'Functional' ?
                        FunctionalityRequirementType::FUNCTIONAL : FunctionalityRequirementType::CONTROL_FACTOR);
        $this->documentManager->persist($requirement);
        $this->documentManager->flush();
        return $this->json($requirement);
    }

    /**
     * @throws MongoDBException
     * @throws Throwable
     */
    #[Route('/api/deleteRequirement', methods: ['POST'])]
    public function deleteRequirement(Request $request): Response
    {
        $data = $request->getPayload();
        $function = $this->documentManager->getRepository(Functionality::class)->findOneBy(['id' => $data->get('functionId')]);
        $requirement = $this->documentManager->getRepository(FunctionalityRequirement::class)->findOneBy(['id' => $data->get('requirementId')]);
        $function->removeRequirement($requirement);
        $this->documentManager->persist($function);
        $this->documentManager->remove($requirement);
        $this->documentManager->flush();
        return $this->json([]);
    }

    #[Route('/api/createRootRequirement', methods: ['POST'])]
    public function createRootRequirement(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $component = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data['rootId']]);
        $requirement = (new RootRequirement())
            ->setContent($data['values']['content'])
            ->setRequirementType($data['values']['type'] == 'NonFunctional' ?
                RootRequirementType::NON_FUNCTIONAL : RootRequirementType::UNINTENDED_OUTPUT);
        $component->addRequirement($requirement);
        $this->documentManager->persist($component);
        $this->documentManager->flush();
        return $this->json($requirement);
    }

    #[Route('/api/editRootRequirement', methods: ['POST'])]
    public function editRootRequirement(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $values = $data['values'];
        $requirement = $this->documentManager->getRepository(RootRequirement::class)->findOneBy(['id' => $data['requirementId']]);
        $requirement->setContent($values['content'])
                    ->setRequirementType($values['type'] == 'NonFunctional' ?
                        RootRequirementType::NON_FUNCTIONAL : RootRequirementType::UNINTENDED_OUTPUT);
        $this->documentManager->persist($requirement);
        $this->documentManager->flush();
        return $this->json($requirement);
    }

    #[Route('/api/deleteRootRequirement', methods: ['POST'])]
    public function deleteRootRequirement(Request $request): Response
    {
        $data = $request->getPayload();
        $component = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data->get('rootId')]);
        $requirement = $this->documentManager->getRepository(RootRequirement::class)->findOneBy(['id' => $data->get('requirementId')]);
        $component->removeRequirement($requirement);
        $this->documentManager->persist($component);
        $this->documentManager->remove($requirement);
        $this->documentManager->flush();
        return $this->json([]);
    }

    #[Route('/api/checkIfTripletIsValid', methods: ['POST'])]
    public function checkIfTripletIsValid(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $f1 = $this->documentManager->getRepository(Functionality::class)->findOneBy(['id' => $data['selectedA']]);
        $f2 = $this->documentManager->getRepository(Functionality::class)->findOneBy(['id' => $data['selectedB']]);
        $f3 = $this->documentManager->getRepository(Functionality::class)->findOneBy(['id' => $data['selectedC']]);
        $triplet = $this->documentManager->getRepository(Triplet::class)->findBy(['f1' => $f1, 'f2' => $f2, 'f3' => $f3]);
        if(empty($triplet)){
            $triplet = (new Triplet())->setF1($f1)->setF2($f2)->setF3($f3);
            $process = $this->documentManager->getRepository(Process::class)->findOneBy(['id' => $data['processId']]);
            $process->addTriplet($triplet);
            $this->documentManager->persist($process);
            $this->documentManager->flush();
            return $this->json([$triplet], Response::HTTP_OK);
        }
        else{
            return $this->json([], Response::HTTP_CONFLICT);
        }
    }

    #[Route('/api/getComponentTriplets', methods: ['POST'])]
    public function getComponentTriplets(Request $request): Response
    {
        $data = $request->getPayload();
        $component = $this->documentManager->getRepository(Component::class)->findOneBy(['id' => $data->get('componentId')]);
        $functionalities = $component->getFunctionalities();
        $allComponentTriplets = [];
        foreach ($functionalities as $functionality) {
            $triplets = $this->documentManager->getRepository(Triplet::class)->findBy(['f2' => $functionality]);
            $allComponentTriplets = array_merge($allComponentTriplets, $triplets);
        }
        return $this->json($allComponentTriplets);
    }

}

