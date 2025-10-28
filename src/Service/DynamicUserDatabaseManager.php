<?php
namespace App\Service;

use App\Document\User;
use Doctrine\Common\EventManager;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Configuration;
use MongoDB\Client;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

#[AsDecorator(decorates: DocumentManager::class)]
class DynamicUserDatabaseManager extends DocumentManager
{
    public function __construct(
        ?Client $client = null,
        ?Configuration $config = null,
        ?EventManager $eventManager = null,
        private readonly Security $security,
    )
    {
        $user = $this->security->getUser();
        if ($user instanceof User) {
            $dbName = $user?->getAssignedDatabase();
            $config->setDefaultDB($dbName);
        }
        parent::__construct($client, $config, $eventManager);
    }
}
