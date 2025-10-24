<?php

namespace App\Repository;

use App\Document\Component;
use App\Document\Process;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;


class ProcessesRepository extends DocumentRepository
{
    public function getProcessTree(?Process $process): array
    {
        if (!$process)
            return [];

        $allComponents = $this->dm->getRepository(Component::class)->findAll();
        $allComponentsAssoc = [];

        foreach ($allComponents as $c) {
            $allComponentsAssoc[(string)$c->getId()] = $c;
            $c->setChildrenComponents(new ArrayCollection()); // inizializza array dei figli
        }

        foreach ($allComponents as $c) {
            $parent = $c->getParentComponent();
            if ($parent) {
                $parentId = (string)$parent->getId();
                if (isset($allComponentsAssoc[$parentId])) {
                    $allComponentsAssoc[$parentId]->addChildComponent($c);
                }
            }
        }

        $root = $process->getComponent();
        if ($root) {
            $rootId = (string)$root->getId();
            if (isset($allComponentsAssoc[$rootId])) {
                $process->setComponent($allComponentsAssoc[$rootId]);
            }
        }

        return [$process];
    }

}
