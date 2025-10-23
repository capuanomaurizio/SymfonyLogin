<?php

namespace App\Service;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ODM\MongoDB\DocumentManager;
use App\Document\Process;
use App\Document\Component;

class ProcessTreeLoader
{

    private DocumentManager $dm;

    public function __construct($dm)
    {
        $this->dm = $dm;
    }

    /**
     * Popola completamente l'albero dei componenti per tutti i processi passati.
     *
     * @param Process[] $processes
     * @return void
     */
    public function populateProcessTrees(array $processes): void
    {

        if (empty($processes)) {
            return;
        }

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

        foreach ($processes as $process) {
            $root = $process->getComponent();
            if ($root) {
                $rootId = (string)$root->getId();
                if (isset($allComponentsAssoc[$rootId])) {
                    $process->setComponent($allComponentsAssoc[$rootId]);
                }
            }
        }
    }

    /**
     * Popola l'albero di un singolo processo.
     */
    public function populateProcessTree(Process $process): void
    {
        $this->populateProcessTrees([$process]);
    }
}
