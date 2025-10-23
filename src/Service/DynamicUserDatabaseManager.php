<?php
namespace App\Service;

use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\Configuration;
use MongoDB\Client;
use Symfony\Bundle\SecurityBundle\Security;

class DynamicUserDatabaseManager
{
    private array $dmCache = [];

    public function __construct(
        private readonly Security $security,
        private readonly Configuration $baseConfig
    ) {}

    public function getManagerForCurrentUser(): DocumentManager
    {
        $user = $this->security->getUser();
        $dbName = $user?->getAssignedDatabase();

        if (!$dbName)
            throw new \RuntimeException('Utente senza database associato.');

        if (isset($this->dmCache[$dbName]))
            return $this->dmCache[$dbName];

        // Crea un nuovo client Mongo che punta a quel database
        $client = new Client($_ENV['MONGODB_URI']);

        // Clona la configurazione base
        $config = clone $this->baseConfig;
        $config->setDefaultDB($dbName);

        $dm = DocumentManager::create($client, $config);
        $this->dmCache[$dbName] = $dm;

        return $dm;
    }
}
